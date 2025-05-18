using Microsoft.AspNetCore.Identity;
using Syllabus.Domain.Users;
using Syllabus.Infrastructure.Data;

namespace Syllabus.Application.Services;

public interface IRoleManagementService
{
    Task<bool> AssignRoleToUserAsync(string userId, UserRole role);
    Task<bool> RemoveRoleFromUserAsync(string userId, UserRole role);
    Task<IEnumerable<UserRole>> GetUserRolesAsync(string userId);
    Task<bool> IsUserInRoleAsync(string userId, UserRole role);
}

public class RoleManagementService : IRoleManagementService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public RoleManagementService(
        UserManager<UserEntity> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<bool> AssignRoleToUserAsync(string userId, UserRole role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        var roleName = role.ToString();
        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            await _roleManager.CreateAsync(new IdentityRole(roleName));
        }

        var result = await _userManager.AddToRoleAsync(user, roleName);
        return result.Succeeded;
    }

    public async Task<bool> RemoveRoleFromUserAsync(string userId, UserRole role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        var result = await _userManager.RemoveFromRoleAsync(user, role.ToString());
        return result.Succeeded;
    }

    public async Task<IEnumerable<UserRole>> GetUserRolesAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return Enumerable.Empty<UserRole>();
        }

        var roles = await _userManager.GetRolesAsync(user);
        return roles.Select(r => Enum.Parse<UserRole>(r));
    }

    public async Task<bool> IsUserInRoleAsync(string userId, UserRole role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        return await _userManager.IsInRoleAsync(user, role.ToString());
    }
} 